// "use client";

// import { Button } from "@/components/ui/button";
// import { UserDetailContext } from "@/context/UserDetailContext";
// import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
// import axios from "axios";
// import {
// 	ArrowUp,
// 	HomeIcon,
// 	ImagePlusIcon,
// 	Key,
// 	LayoutDashboard,
// 	Loader2Icon,
// 	User,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useContext, useState } from "react";
// import { toast } from "sonner";
// import { v4 as uuidV4 } from "uuid";

// const suggestion = [
// 	{
// 		label: "Dashboard",
// 		prompt: "Create an analytics dashboard to track customers and revenue data for a SaaS",
// 		icon: LayoutDashboard,
// 	},
// 	{
// 		label: "SignUp Form",
// 		prompt: "Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox",
// 		icon: Key,
// 	},
// 	{
// 		label: "Hero",
// 		prompt: "Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect, subtitle, CTA, small social proof and an image.",
// 		icon: HomeIcon,
// 	},
// 	{
// 		label: "User Profile Card",
// 		prompt: "Create a modern user profile card component for a social media website",
// 		icon: User,
// 	},
// ];

// const Hero = () => {
// 	const [userInput, setUserInput] = useState("");
// 	const [loading, setLoading] = useState(false);
// 	const { user } = useUser();
// 	const {has} = useAuth();
// 	const {userDetail, setUserDetail} = useContext(UserDetailContext)

// 	const hasProAccess = has?.({ plan: "pro" }) ?? false;

// if (!userDetail) {
//   toast.loading("Loading user data...");
//   setLoading(false);
//   return;
// }

// if ((userDetail.credits ?? 0) <= 0 && !hasProAccess) {
//   toast.error("Not enough credits!!! Upgrade to PRO");
//   setLoading(false);
//   return;
// }
// 	const messages = [
// 		{
// 			role: "user",
// 			content: userInput,
// 		},
// 	];

// 	const router = useRouter();

// 	function generate4DigitNumber(): number {
// 		return Math.floor(1000 + Math.random() * 9000);
// 	}

// const createNewProject = async () => {
//   if (loading) return;

//   setLoading(true);

//   if (!userDetail) {
//     toast.loading("Loading user data...");
//     setLoading(false);
//     return;
//   }

//   if ((userDetail.credits ?? 0) <= 0 && !hasProAccess) {
//     toast.error("Not enough credits!!! Upgrade to PRO");
//     setLoading(false);
//     return;
//   }

//   const projectId = uuidV4();
//   const frameId = `${generate4DigitNumber()}-${Date.now()}`;

//   try {
//     await axios.post("/api/projects", {
//       projectId,
//       frameId,
//       messages,
//     });

//     toast.success("Project created successfully!");

//     router.push(`/playground/${projectId}?frameId=${frameId}`);

//     setUserDetail((prev: any) => ({
//       ...prev,
//       credits: (prev?.credits ?? 0) - 1,
//     }));
//   } catch (error) {
//     toast.error("Failed to create project.");
//     console.error(error);
//   } finally {
//     setLoading(false);
//   }
// };
// 	return (
// 		<div className="flex flex-col items-center h-[85vh] justify-center">
// 			<h2 className="font-bold text-6xl">
// 				Let&apos;s build your website!
// 			</h2>
// 			<p className="mt-2 text-xl text-gray-500">
// 				Generate, Edit and Explore designs with Webgenix
// 			</p>

// 			<div className="w-full max-w-2xl p-5 border mt-5 rounded-2xl">
// 				<textarea
// 					placeholder="Describe your website..."
// 					className="w-full h-24 focus:outline-none focus:ring-0 resize-none"
// 					value={userInput}
// 					onChange={(e) => setUserInput(e.target.value)}
// 				/>

// 				<div className="flex justify-between items-center">
// 					<button>
// 						<ImagePlusIcon size={24} />
// 					</button>
// 					{!user ? (
// 						<SignInButton
// 							mode="modal"
// 							forceRedirectUrl={"/workspace"}
// 						>
// 							<Button disabled={!userInput}>
// 								<ArrowUp />
// 							</Button>
// 						</SignInButton>
// 					) : (
// 						<Button
// 							disabled={!userInput || loading}
// 							onClick={createNewProject}
// 						>
// 							{loading ? (
// 								<Loader2Icon className="animate-spin" />
// 							) : (
// 								<ArrowUp />
// 							)}
// 						</Button>
// 					)}
// 				</div>
// 			</div>

// 			<div className="flex gap-3 mt-5">
// 				{suggestion.map((sugg, index) => (
// 					<Button
// 						key={index}
// 						variant={"outline"}
// 						onClick={() => setUserInput(sugg.prompt)}
// 					>
// 						<sugg.icon />
// 						{sugg.label}
// 					</Button>
// 				))}
// 			</div>
// 		</div>
// 	);
// };
// export default Hero;

"use client";

import { Button } from "@/components/ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  ArrowUp,
  HomeIcon,
  ImagePlusIcon,
  Key,
  LayoutDashboard,
  Loader2Icon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidV4 } from "uuid";

const suggestion = [
  {
    label: "Dashboard",
    prompt:
      "Create an analytics dashboard to track customers and revenue data for a SaaS",
    icon: LayoutDashboard,
  },
  {
    label: "SignUp Form",
    prompt:
      "Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect, subtitle, CTA, small social proof and an image.",
    icon: HomeIcon,
  },
  {
    label: "User Profile Card",
    prompt:
      "Create a modern user profile card component for a social media website",
    icon: User,
  },
];

const Hero = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const { has } = useAuth();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  const router = useRouter();

  const hasProAccess = has?.({ plan: "pro" }) ?? false;

  const messages = [
    {
      role: "user",
      content: userInput,
    },
  ];

  function generate4DigitNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  const createNewProject = async () => {
    if (loading) return;

    setLoading(true);

    if (!userDetails) {
      toast.loading("Loading user data...");
      setLoading(false);
      return;
    }

    if ((userDetails.credits ?? 0) <= 0 && !hasProAccess) {
      toast.error("Not enough credits!!! Upgrade to PRO");
      setLoading(false);
      return;
    }

    const projectId = uuidV4();
    const frameId = `${generate4DigitNumber()}-${Date.now()}`;

    try {
      await axios.post("/api/projects", {
        projectId,
        frameId,
        messages,
      });

      toast.success("Project created successfully!");

      router.push(`/playground/${projectId}?frameId=${frameId}`);

      setUserDetails((prev: any) => ({
        ...prev,
        credits: (prev?.credits ?? 0) - 1,
      }));
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error(
        error?.response?.data?.error || "Failed to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-[85vh] justify-center">
      <h2 className="font-bold text-6xl">
        Let&apos;s build your website!
      </h2>

      <p className="mt-2 text-xl text-gray-500">
        Generate, Edit and Explore designs with Webgenix
      </p>

      <div className="w-full max-w-2xl p-5 border mt-5 rounded-2xl">
        <textarea
          placeholder="Describe your website..."
          className="w-full h-24 focus:outline-none focus:ring-0 resize-none"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        <div className="flex justify-between items-center">
          <button>
            <ImagePlusIcon size={24} />
          </button>

          {!user ? (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <Button disabled={!userInput}>
                <ArrowUp />
              </Button>
            </SignInButton>
          ) : (
            <Button
              disabled={!userInput || loading}
              onClick={createNewProject}
            >
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <ArrowUp />
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        {suggestion.map((sugg, index) => (
          <Button
            key={index}
            variant={"outline"}
            onClick={() => setUserInput(sugg.prompt)}
          >
            <sugg.icon />
            {sugg.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
